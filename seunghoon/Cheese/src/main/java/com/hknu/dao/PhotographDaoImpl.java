package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Photograph;

@Repository
public class PhotographDaoImpl extends BaseDao<Photograph> {
	@Autowired
	public PhotographDaoImpl(DataSource dataSource) {
		super(dataSource, "Photographs", "photograph_id");
	}
	
	@Override
	public Photograph createObjectFromResultSet(ResultSet rs) throws SQLException {
		Photograph photograph = new Photograph(
				rs.getInt("photograph_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				rs.getDate("created_at"),
				rs.getDate("shooted_at"),
				rs.getBytes("photo_image"));
		return photograph;
	}
}