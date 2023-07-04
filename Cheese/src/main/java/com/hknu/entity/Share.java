package com.hknu.entity;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class Share {
	private int share_id;
	private int customer_id;
	private Date created_at;
}
