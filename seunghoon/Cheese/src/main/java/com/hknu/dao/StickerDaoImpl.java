package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Sticker;

@Repository
public class StickerDaoImpl extends BaseDao<Sticker> {
	@Autowired
	public StickerDaoImpl(DataSource dataSource) {
		super(dataSource, "Stickers", "sticker_id");
	}
	
	@Override
	public Sticker createObjectFromResultSet(ResultSet rs) throws SQLException {
		Sticker sticker = new Sticker(
				rs.getInt("sticker_id"),
				rs.getInt("branch_id"),
				rs.getBytes("sticker_image"));
		return sticker;
	}
}