package com.hknu.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class TimelapseDto {
	private Integer timelapseId;
	private Integer customerId;
	private Integer branchId;
	private Timestamp createdAt;
	private byte[] video;
}
