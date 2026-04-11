package com.tcb_server.content.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;

@Service
public class FileUploadService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");

    @Value("${upload.path:uploads}")
    private String uploadPath;

    /**
     * 코치 프로필 이미지 저장
     * @return 저장된 파일의 URL 경로 (/uploads/coach/{coachId}/profile.{ext})
     */
    public String saveProfileImage(Long coachId, MultipartFile file) throws IOException {
        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new IllegalArgumentException("허용되지 않는 파일 형식입니다. (jpg, png, gif, webp)");
        }

        Path dir = Paths.get(uploadPath, "coach", String.valueOf(coachId));
        Files.createDirectories(dir);

        // 기존 프로필 이미지 삭제 후 덮어쓰기
        String filename = "profile." + ext;
        Path savePath = dir.resolve(filename);
        file.transferTo(savePath.toAbsolutePath());

        return "/uploads/coach/" + coachId + "/" + filename;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
