package com.hknu.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class Filter {
	private final Integer filter_id;
	private Integer branch_id;
	private final Integer brightness;
	private final Integer exposure;
	private final Integer contrast;
	private final Integer chroma;
	private final Integer temperature;
	private final Integer livliness;
	private final Integer tint;
	private final Integer tone;
	private final Integer highlight;
	private final Integer shadow;
	private final Integer sharpness;
	private final Integer grain;
	private final Integer vineting;
	private final Integer afterImage;
	private final Integer dehaze;
	private final Integer posterize;
	private final Integer blur;
	private final Integer mosaic;
}
