package com.hknu.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class SharedPhoto {
	private int shared_photo_id;
	private int share_id;
	private int photograph_id;
}
