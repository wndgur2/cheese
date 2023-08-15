package com.hknu.service;

import java.util.Collections;
import java.util.Comparator;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;

import com.hknu.domain.Room;
import com.hknu.util.Parser;

@org.springframework.stereotype.Service
public class RoomService {
	@Autowired
	private Parser parser;
    private final Set<Room> rooms = new TreeSet<>(Comparator.comparing(Room::getId));

    public Set<Room> getRooms() {
        final TreeSet<Room> defensiveCopy = new TreeSet<>(Comparator.comparing(Room::getId));
        defensiveCopy.addAll(rooms);

        return defensiveCopy;
    }

    public Boolean addRoom(final Room room) {
        return rooms.add(room);
    }

    public Optional<Room> findRoomByStringId(final String sid) {
        // simple get() because of parser errors handling
        return rooms.stream().filter(r -> r.getId().equals(parser.parseId(sid).get())).findAny();
    }

    public Integer getRoomId(Room room) {
        return room.getId();
    }

    public Map<String, WebSocketSession> getClients(final Room room) {
        return Optional.ofNullable(room)
                .map(r -> Collections.unmodifiableMap(r.getClients()))
                .orElse(Collections.emptyMap());
    }

    public WebSocketSession addClient(
    		final Room room, 
    		final String name, 
    		final WebSocketSession session) {
        return room.getClients().put(name, session);
    }

    public WebSocketSession removeClientByName(final Room room, final String name) {
        return room.getClients().remove(name);
    }
}
