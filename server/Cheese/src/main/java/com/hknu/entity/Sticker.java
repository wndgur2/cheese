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
public class Sticker {
	private final Integer sticker_id;
	private Integer branch_id;
	private final byte[] sticker_image;
}
