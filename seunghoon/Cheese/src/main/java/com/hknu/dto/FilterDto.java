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
	private int filterId;
	private int brightness;
	private int exposure;
	private int contrast;
	private int chroma;
	private int temperature;
	private int livliness;
	private int tint;
	private int tone;
	private int highlight;
	private int shadow;
	private int sharpness;
	private int grain;
	private int vineting;
	private int afterImage;
	private int dehaze;
	private int posterize;
	private int blur;
	private int mosaic;
}
