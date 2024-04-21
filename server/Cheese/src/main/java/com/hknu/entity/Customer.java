package com.hknu.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
	private Integer customer_id;
	private String email;
	private String password;
	private double cloud_size;
	private String nickname;
}
