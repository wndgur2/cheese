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
	private final Integer shared_photo_id;
	private final Integer share_id;
	private final Integer photograph_id;
}
