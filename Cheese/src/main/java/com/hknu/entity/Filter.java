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
	private final int filter_id;
	private int branch_id;
	private final int brightness;
	private final int exposure;
	private final int contrast;
	private final int chroma;
	private final int temperature;
	private final int livliness;
	private final int tint;
	private final int tone;
	private final int highlight;
	private final int shadow;
	private final int sharpness;
	private final int grain;
	private final int vineting;
	private final int afterImage;
	private final int dehaze;
	private final int posterize;
	private final int blur;
	private final int mosaic;
}
