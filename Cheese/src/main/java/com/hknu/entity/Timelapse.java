package com.hknu.entity;

import java.sql.Date;

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
public class Timelapse {
	private final int timelapse_id;
	private final int customer_id;
	private int branch_id;
	private final Date created_at;
	private final byte[] video;
}
