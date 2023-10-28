package com.hknu.util;

import java.util.Optional;

public class Parser {
	public Optional<Integer> parseId(String sid) {
		Integer id = null;
		try {
			id = Integer.valueOf(sid);
		} catch (Exception e) {
			System.out.println(String.format("An error occured: {}", e.getMessage()));
		}

		return Optional.ofNullable(id);
	}
}