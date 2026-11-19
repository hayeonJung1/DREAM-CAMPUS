package com.dreamcampus.backend.exam.dto;

import java.util.Map;

public record GradeRequest(Map<Integer, String> answers) {
}
