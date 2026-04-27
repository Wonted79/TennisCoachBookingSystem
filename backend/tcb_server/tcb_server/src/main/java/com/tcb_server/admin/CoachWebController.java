package com.tcb_server.admin;

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
@RequestMapping("/coach")
@RequiredArgsConstructor
public class CoachWebController {

    private final ContentService contentService;
    private final FileUploadService fileUploadService;

    // ── 대시보드 ──────────────────────────────────────

    @GetMapping
    public String dashboard(HttpSession session) {
        return "redirect:/coach/profile";
    }

    // ── 본인 프로필 편집 ───────────────────────────────

    @GetMapping("/profile")
    public String profilePage(HttpSession session, Model model) {
        Long coachId = (Long) session.getAttribute("adminCoachId");
        if (coachId == null) {
            return "redirect:/admin/login";
        }
        model.addAttribute("adminName", session.getAttribute("adminName"));
        model.addAttribute("adminRole", "COACH");
        model.addAttribute("coach", contentService.getCoach(coachId));
        model.addAttribute("notice", contentService.getNotice(coachId));
        model.addAttribute("infoAction", "/coach/info");
        model.addAttribute("noticeAction", "/coach/notice");
        model.addAttribute("backUrl", "/coach");

        Object infoError = session.getAttribute("infoError");
        if (infoError != null) {
            model.addAttribute("infoError", infoError);
            session.removeAttribute("infoError");
        }

        return "admin/coach";
    }

    @PostMapping("/info")
    public String updateInfo(
            @RequestParam String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String introduction,
            @RequestParam(required = false) String education,
            @RequestParam(required = false) String awards,
            @RequestParam(required = false) String certifications,
            @RequestParam(required = false) MultipartFile profileImage,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Long coachId = (Long) session.getAttribute("adminCoachId");

        String imageUrl = contentService.getCoach(coachId).getProfileImageUrl();
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                imageUrl = fileUploadService.saveProfileImage(coachId, profileImage);
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("infoError", "이미지 업로드 실패: " + e.getMessage());
                return "redirect:/coach/profile";
            }
        }

        contentService.updateCoach(coachId,
                name,
                phone != null ? phone : "",
                imageUrl != null ? imageUrl : "",
                introduction != null ? introduction : "",
                education != null ? education : "",
                awards != null ? awards : "",
                certifications != null ? certifications : "");

        session.setAttribute("adminName", name);
        redirectAttributes.addFlashAttribute("infoSuccess", "정보가 저장되었습니다.");
        return "redirect:/coach/profile";
    }

    @PostMapping("/notice")
    public String updateNotice(
            @RequestParam String content,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Long coachId = (Long) session.getAttribute("adminCoachId");
        contentService.updateNotice(coachId, content);
        redirectAttributes.addFlashAttribute("noticeSuccess", "공지사항이 저장되었습니다.");
        return "redirect:/coach/profile";
    }

    // ── 예약 관리 ─────────────────────────────────────

    @GetMapping("/booking")
    public String bookingPage(HttpSession session, Model model) {
        Long coachId = (Long) session.getAttribute("adminCoachId");
        if (coachId == null) {
            return "redirect:/admin/login";
        }
        model.addAttribute("adminId", session.getAttribute("adminId"));
        model.addAttribute("adminName", session.getAttribute("adminName"));
        model.addAttribute("coachId", coachId);
        model.addAttribute("coach", contentService.getCoach(coachId));
        return "admin/booking";
    }
}
