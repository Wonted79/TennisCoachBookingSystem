package com.tcb_server.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();

        // 인증 없이 접근 가능한 경로
        if (uri.equals("/swagger-ui/index.html") || uri.equals("/admin/login") || uri.equals("/admin/logout")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminId") == null) {
            response.sendRedirect("/admin/login");
            return false;
        }

        String role = (String) session.getAttribute("adminRole");

        // /admin 경로는 ADMIN role만
        if (uri.equals("/admin") || uri.startsWith("/admin/")) {
            if (!"ADMIN".equals(role)) {
                response.sendRedirect("/coach");
                return false;
            }
        }

        // /coach 경로는 COACH role만
        if (uri.equals("/coach") || uri.startsWith("/coach/")) {
            if (!"COACH".equals(role)) {
                response.sendRedirect("/admin");
                return false;
            }
        }

        return true;
    }
}
