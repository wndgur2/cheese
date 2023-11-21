package com.hknu.entity;

import java.sql.Timestamp;

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
public class Photograph {
	private final Integer photograph_id;
	private final Integer customer_id;
	private Integer branch_id;
	private Timestamp created_at;
	private final byte[] photo_image;
}
