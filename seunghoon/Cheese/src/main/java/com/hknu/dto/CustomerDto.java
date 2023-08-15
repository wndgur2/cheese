package com.hknu.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class CustomerDto {
	private Integer customerId;
	private String email;
	private String password;
	private double cloudSize;
	private String nickname;
	private List<PaymentDto> payments;
	private List<PhotographDto> photographs;
	private List<TimelapseDto> timelapses;
	private List<ShareDto> shares;
}
