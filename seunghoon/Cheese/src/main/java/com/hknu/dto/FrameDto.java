package com.hknu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class FrameDto {
	private Integer frameId;
	private Integer branchId;
	private byte[] frameImage;
}
