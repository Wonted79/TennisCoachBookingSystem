package com.tcb_server.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public String handleMaxUploadSize(MaxUploadSizeExceededException e,
                                      HttpServletRequest request,
                                      HttpSession session) {
        session.setAttribute("infoError", "이미지 파일이 너무 큽니다. 5MB 이하의 파일을 선택해주세요.");

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isBlank()) {
            return "redirect:" + referer;
        }

        // fallback
        String role = (String) session.getAttribute("adminRole");
        return "ADMIN".equals(role) ? "redirect:/admin" : "redirect:/coach/profile";
    }
}
