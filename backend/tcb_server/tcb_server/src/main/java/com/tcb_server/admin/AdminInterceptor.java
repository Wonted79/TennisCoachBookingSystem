package com.tcb_server.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class AdminInterceptor implements HandlerInterceptor {

    // 세션/role 체크 없이 통과
    private static final String[] AUTH_PATHS = {
            "/admin/login", "/admin/register", "/admin/change-password", "/admin/logout"
    };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();

        for (String path : AUTH_PATHS) {
            if (uri.equals(path)) return true;
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
