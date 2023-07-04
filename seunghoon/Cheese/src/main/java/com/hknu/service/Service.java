package com.hknu.service;

import java.util.List;

public interface Service<E> {
	public E getById(int id);
	public List<E> getAll();
	public void insert(E data);
	public void update(E data);
	public void delete(int id);
}
