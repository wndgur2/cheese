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
public class Photograph {
	private final int photograph_id;
	private final int customer_id;
	private int branch_id;
	private final Date created_at;
	private Date shooted_at;
	private final byte[] photo_image;

	public Photograph(int pid, int cid, Date ca, Date sa, byte[] pi) {
		this.photograph_id = pid;
		this.customer_id = cid;
		this.created_at = ca;
		this.shooted_at = sa;
		this.photo_image = pi;
	}
}
