package com.hknu.domain;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.web.socket.WebSocketSession;

import lombok.Getter;

@Getter
public class Room {
	private final Integer id;
	private final Map<String, WebSocketSession> deviceClient = new LinkedHashMap<>();
	private final Map<String, WebSocketSession> cameraClient = new LinkedHashMap<>();
	private final Map<String, WebSocketSession> printerClient = new LinkedHashMap<>();

	public Room(Integer id) {
		this.id = id;
	}

	@Override
	public boolean equals(final Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		final Room room = (Room) o;
		return Objects.equals(getId(), room.getId()) &&
				Objects.equals(getDeviceClient(), room.getDeviceClient()) &&
				Objects.equals(getCameraClient(), room.getCameraClient()) &&
				Objects.equals(getPrinterClient(), room.getPrinterClient());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getId(), getDeviceClient(), getCameraClient(), getPrinterClient());
	}
}
