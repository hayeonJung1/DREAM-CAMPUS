package com.dreamcampus.backend.admin;

import com.dreamcampus.backend.common.ApiResponse;
import com.dreamcampus.backend.common.exception.ApiException;
import com.dreamcampus.backend.user.Member;
import com.dreamcampus.backend.user.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/members")
public class AdminMemberController {

    private final MemberRepository memberRepository;
    private final AdminGuard adminGuard;

    public AdminMemberController(MemberRepository memberRepository, AdminGuard adminGuard) {
        this.memberRepository = memberRepository;
        this.adminGuard = adminGuard;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> list(
            @RequestParam(required = false) String keyword,
            HttpServletRequest request
    ) {
        adminGuard.requireAdmin(request);
        List<Member> members = keyword == null || keyword.isBlank()
                ? memberRepository.findAll()
                : memberRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(keyword.trim(), keyword.trim());
        return ResponseEntity.ok(ApiResponse.ok("회원 목록을 조회했습니다.", members.stream().map(this::toMap).toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> detail(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        adminGuard.requireAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", toMap(find(id))));
    }

    @PatchMapping("/{id}/role")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> changeRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {
        Member administrator = adminGuard.requireAdmin(request);
        String role = body.get("role");
        if (role == null || !List.of("USER", "ADMIN").contains(role)) {
            throw ApiException.badRequest("권한 값은 USER 또는 ADMIN이어야 합니다.");
        }
        if (administrator.getUserId().equals(id)) {
            throw ApiException.badRequest("현재 로그인한 계정의 권한은 변경할 수 없습니다.");
        }
        Member target = find(id);
        if ("ADMIN".equals(target.getRole()) && "ACTIVE".equals(target.getStatus()) && "USER".equals(role)
                && memberRepository.countByRoleAndStatus("ADMIN", "ACTIVE") <= 1) {
            throw ApiException.conflict("마지막 관리자 권한은 해제할 수 없습니다.");
        }
        target.updateRole(role);
        return ResponseEntity.ok(ApiResponse.ok("회원 권한을 변경했습니다.", toMap(memberRepository.save(target))));
    }

    @PatchMapping("/{id}/status")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> changeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            HttpServletRequest request
    ) {
        Member administrator = adminGuard.requireAdmin(request);
        String status = body.get("status");
        if (status == null || !List.of("ACTIVE", "SUSPENDED").contains(status)) {
            throw ApiException.badRequest("상태 값은 ACTIVE 또는 SUSPENDED이어야 합니다.");
        }
        if (administrator.getUserId().equals(id)) {
            throw ApiException.badRequest("현재 로그인한 계정은 정지할 수 없습니다.");
        }
        Member target = find(id);
        if ("ADMIN".equals(target.getRole()) && "ACTIVE".equals(target.getStatus()) && "SUSPENDED".equals(status)
                && memberRepository.countByRoleAndStatus("ADMIN", "ACTIVE") <= 1) {
            throw ApiException.conflict("마지막 활성 관리자 계정은 정지할 수 없습니다.");
        }
        target.updateStatus(status);
        return ResponseEntity.ok(ApiResponse.ok("회원 상태를 변경했습니다.", toMap(memberRepository.save(target))));
    }

    private Member find(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("회원을 찾을 수 없습니다."));
    }

    private Map<String, Object> toMap(Member member) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", member.getUserId());
        map.put("email", member.getEmail());
        map.put("name", member.getName());
        map.put("role", member.getRole());
        map.put("status", member.getStatus());
        map.put("createdAt", member.getCreatedAt());
        return map;
    }
}
