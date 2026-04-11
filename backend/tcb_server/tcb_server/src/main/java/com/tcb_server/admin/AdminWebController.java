package com.tcb_server.admin;

import com.tcb_server.auth.dto.LoginRequest;
import com.tcb_server.auth.dto.LoginResponse;
import com.tcb_server.auth.dto.RegisterRequest;
import com.tcb_server.auth.service.AuthService;
import com.tcb_server.content.service.ContentService;
import com.tcb_server.content.service.FileUploadService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class AdminWebController {

    private final AuthService authService;
    private final ContentService contentService;
    private final FileUploadService fileUploadService;

    // ── 로그인 / 회원가입 / 비밀번호 변경 ─────────────

    @GetMapping("/admin/login")
    public String loginPage() {
        return "admin/login";
    }

    @PostMapping("/admin/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        LoginRequest request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);

        LoginResponse response = authService.login(request);
        if (response == null) {
            redirectAttributes.addFlashAttribute("loginError", "아이디 또는 비밀번호가 잘못되었습니다.");
            return "redirect:/admin/login";
        }

        session.setAttribute("adminId", response.getId());
        session.setAttribute("adminName", response.getDisplayName());
        session.setAttribute("adminRole", response.getRole());
        session.setAttribute("adminCoachId", response.getCoachProfileId());

        return "ADMIN".equals(response.getRole()) ? "redirect:/admin" : "redirect:/coach";
    }

    @PostMapping("/admin/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin/login";
    }

    @GetMapping("/admin/register")
    public String registerPage() {
        return "admin/register";
    }

    @PostMapping("/admin/register")
    public String register(
            @RequestParam String username,
            @RequestParam String password,
            RedirectAttributes redirectAttributes) {

        RegisterRequest request = new RegisterRequest();
        request.setUsername(username);
        request.setPassword(password);

        String error = authService.register(request);
        if (error != null) {
            redirectAttributes.addFlashAttribute("registerError", error);
            return "redirect:/admin/register";
        }
        redirectAttributes.addFlashAttribute("registerSuccess", "회원가입이 완료되었습니다. 로그인해주세요.");
        return "redirect:/admin/login";
    }

    @GetMapping("/admin/change-password")
    public String changePasswordPage() {
        return "admin/change-password";
    }

    @PostMapping("/admin/change-password")
    public String changePassword(
            @RequestParam String username,
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            RedirectAttributes redirectAttributes) {

        String error = authService.changePassword(username, currentPassword, newPassword);
        if (error != null) {
            redirectAttributes.addFlashAttribute("pwError", error);
            return "redirect:/admin/change-password";
        }
        redirectAttributes.addFlashAttribute("pwSuccess", "비밀번호가 변경되었습니다.");
        return "redirect:/admin/login";
    }

    // ── ADMIN 메인 (코치 목록) ─────────────────────────

    @GetMapping("/admin")
    public String mainPage(HttpSession session, Model model) {
        model.addAttribute("adminName", session.getAttribute("adminName"));
        model.addAttribute("coaches", contentService.getAllCoaches());
        return "admin/main";
    }

    // ── 코치 편집 (ADMIN) ─────────────────────────────

    @GetMapping("/admin/coach/{id}")
    public String coachEditPage(@PathVariable Long id, HttpSession session, Model model) {
        model.addAttribute("adminName", session.getAttribute("adminName"));
        model.addAttribute("adminRole", "ADMIN");
        model.addAttribute("coach", contentService.getCoach(id));
        model.addAttribute("notice", contentService.getNotice(id));
        model.addAttribute("infoAction", "/admin/coach/" + id + "/info");
        model.addAttribute("noticeAction", "/admin/coach/" + id + "/notice");
        model.addAttribute("backUrl", "/admin");

        // 전역 예외 핸들러가 세션에 저장한 에러 메시지 처리
        Object infoError = session.getAttribute("infoError");
        if (infoError != null) {
            model.addAttribute("infoError", infoError);
            session.removeAttribute("infoError");
        }

        return "admin/coach";
    }

    @PostMapping("/admin/coach/{id}/info")
    public String updateCoachInfo(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String introduction,
            @RequestParam(required = false) String education,
            @RequestParam(required = false) String awards,
            @RequestParam(required = false) String certifications,
            @RequestParam(required = false) MultipartFile profileImage,
            RedirectAttributes redirectAttributes) {

        String imageUrl = contentService.getCoach(id).getProfileImageUrl();
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                imageUrl = fileUploadService.saveProfileImage(id, profileImage);
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("infoError", "이미지 업로드 실패: " + e.getMessage());
                return "redirect:/admin/coach/" + id;
            }
        }

        contentService.updateCoach(id,
                name,
                phone != null ? phone : "",
                imageUrl != null ? imageUrl : "",
                introduction != null ? introduction : "",
                education != null ? education : "",
                awards != null ? awards : "",
                certifications != null ? certifications : "");

        redirectAttributes.addFlashAttribute("infoSuccess", "코치 정보가 저장되었습니다.");
        return "redirect:/admin/coach/" + id;
    }

    @PostMapping("/admin/coach/{id}/notice")
    public String updateNotice(
            @PathVariable Long id,
            @RequestParam String content,
            RedirectAttributes redirectAttributes) {

        contentService.updateNotice(id, content);
        redirectAttributes.addFlashAttribute("noticeSuccess", "공지사항이 저장되었습니다.");
        return "redirect:/admin/coach/" + id;
    }

    @PostMapping("/admin/coach/{id}/delete")
    public String deleteCoach(
            @PathVariable Long id,
            RedirectAttributes redirectAttributes) {

        contentService.deleteCoach(id);
        redirectAttributes.addFlashAttribute("success", "코치가 삭제되었습니다.");
        return "redirect:/admin";
    }

    // ── 예약 관리 (ADMIN) ─────────────────────────────

    @GetMapping("/admin/booking")
    public String bookingPage(
            @RequestParam Long coachId,
            HttpSession session, Model model) {

        model.addAttribute("adminId", session.getAttribute("adminId"));
        model.addAttribute("adminName", session.getAttribute("adminName"));
        model.addAttribute("coachId", coachId);
        model.addAttribute("coach", contentService.getCoach(coachId));
        return "admin/booking";
    }
}
