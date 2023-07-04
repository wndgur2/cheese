package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public interface Dao<E> {
	public E createObjectFromResultSet(ResultSet rs) throws SQLException;
	public E getById(int id);
	public List<E> getAll();
	public int getMaxPkValue();
	public void insert(E data);
	public void update(E data);
	public void delete(int id);
}