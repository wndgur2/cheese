package com.hknu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class FilterDto {
	private Integer filterId;
	private Integer branchId;
	private Integer brightness;
	private Integer exposure;
	private Integer contrast;
	private Integer chroma;
	private Integer temperature;
	private Integer livliness;
	private Integer tint;
	private Integer tone;
	private Integer highlight;
	private Integer shadow;
	private Integer sharpness;
	private Integer grain;
	private Integer vineting;
	private Integer afterImage;
	private Integer dehaze;
	private Integer posterize;
	private Integer blur;
	private Integer mosaic;
}
