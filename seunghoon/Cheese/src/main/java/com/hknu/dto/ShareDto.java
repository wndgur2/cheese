package com.hknu.dto;

import java.sql.Date;
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
	private int shareId;
	private int customerId;
	private Date createdAt;
	private HashMap<Integer, PhotographDto> sharedPhotoMap;
}
