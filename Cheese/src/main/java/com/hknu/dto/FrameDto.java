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
	private int frameId;
	private byte[] frameImage;
}
