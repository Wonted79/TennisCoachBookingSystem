package com.tcb_server.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendTempPassword(String toEmail, String username, String tempPassword) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("[Tennis 코치 관리] 코치 계정이 생성되었습니다");
        msg.setText(
                "안녕하세요,\n\n" +
                "관리자가 코치 계정을 생성하였습니다.\n\n" +
                "아이디: " + username + "\n" +
                "임시 비밀번호: " + tempPassword + "\n\n" +
                "로그인 후 반드시 비밀번호를 변경해주세요.\n"
        );
        mailSender.send(msg);
    }

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("[Tennis 코치 관리] 비밀번호 변경 인증번호");
        msg.setText(
                "비밀번호 변경 인증번호: " + code + "\n\n" +
                "유효시간: 3분\n\n" +
                "본인이 요청하지 않은 경우 이 메일을 무시해 주세요."
        );
        mailSender.send(msg);
    }
}
