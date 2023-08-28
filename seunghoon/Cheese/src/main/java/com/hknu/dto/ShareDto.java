package com.hknu.dto;

import java.sql.Timestamp;
import java.util.HashMap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ShareDto {
	private Integer shareId;
	private Integer customerId;
	private String nickname;
	private Integer branchId;
	private Timestamp createdAt;
	private HashMap<Integer, PhotographDto> sharedPhotoMap;
}
