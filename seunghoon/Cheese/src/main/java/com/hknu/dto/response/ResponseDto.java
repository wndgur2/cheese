package com.hknu.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@RequiredArgsConstructor(staticName = "of")
@AllArgsConstructor(staticName = "of")
public class ResponseDto<T> {
	private final String message;
	private T data;
}
