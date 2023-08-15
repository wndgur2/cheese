package com.hknu.dao;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.ResultSetExtractor;

public class BaseDao<E> implements Dao<E> {
	protected final JdbcTemplate jdbcTemplate;
	protected final String tableName;
	protected final String tableId;
	
	public BaseDao(DataSource dataSource, String tableName, String tableId) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
		this.tableName = tableName;
		this.tableId = tableId;
	}
	
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}
	
	// Overriding Method
	public E createObjectFromResultSet(ResultSet rs) throws SQLException {
		return null;
	}
	
	public E getById(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE %s=?;", tableName, tableId);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<E>() { 
			public E extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					E object = createObjectFromResultSet(rs);
					return object;
				}
				throw new NullPointerException("아이디가 존재하지 않습니다.");
			}
		}, id);
	}
	
	public List<E> getAll() {
		String sql = String.format("SELECT * FROM %s;", tableName);
		
		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<E>>() { 
			public List<E> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<E> objectList = new ArrayList<>();
					E firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						E object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;	
				}
				throw new NullPointerException("조회할 데이터가 없습니다.");
			}
		});
	}
	
	public Integer getMaxPkValue() {
		String sql = String.format("SELECT MAX(%s) FROM %s;", tableId, tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<Integer>() { 
			public Integer extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					Integer value = rs.getInt(1);
					return value + 1;
				}
				return null;
			}
		});
	}

	public void insert(E data) {
		String setSql = String.format("INSERT INTO %s VALUES(", tableName);
	    
	    Field[] fields = data.getClass().getDeclaredFields();
	    List<String> tableCoulumList = new ArrayList<>();

	    for (Field field : fields) {
	    	field.setAccessible(true);
	        tableCoulumList.add("?");
	    } 

	    setSql += String.join(", ", tableCoulumList);
	    setSql += ");";
	    
	    final String sql = setSql;
	    
	    this.jdbcTemplate.update(new PreparedStatementCreator() {
	        @Override
	        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
	            PreparedStatement preparedStatement = con.prepareStatement(sql);

	            int index = 1;
	            for (Field field : fields) {
	                field.setAccessible(true);
	                try {
	                    Object fieldValue = field.get(data);
	                    preparedStatement.setObject(index, fieldValue);
	                    index++;
	                } 
	                catch (IllegalAccessException e) {
	                    e.printStackTrace();
	                }
	            }
	            return preparedStatement;
	        }
	    });
	}
	
	public void update(E data) {
	    String setSql = String.format("UPDATE %s SET ", tableName);
	    
	    Object setTableIdValue = null;
	    Field[] fields = data.getClass().getDeclaredFields();
	    List<String> tableCoulumList = new ArrayList<>();

	    for (Field field : fields) {
	        field.setAccessible(true);
	        String fieldName = field.getName();
	        try {
	            Object fieldValue = field.get(data);
	            if (fieldValue != null && !fieldName.equals(tableId)) {
	            	tableCoulumList.add(String.format("%s=?", fieldName));
	            }
	            else {
	            	setTableIdValue = fieldValue;
	            }
	        } 
	        catch (IllegalAccessException e) {
	            e.printStackTrace();
	        }
	    }

	    setSql += String.join(", ", tableCoulumList);
	    setSql += String.format(" WHERE %s=?;", tableId);
	    
	    final String sql = setSql;
	    final Object tableIdValue = setTableIdValue;
	    
	    this.jdbcTemplate.update(new PreparedStatementCreator() {
	        @Override
	        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
	            PreparedStatement preparedStatement = con.prepareStatement(sql);

	            int index = 1;
	            for (Field field : fields) {
	                field.setAccessible(true);
	                try {
	                    Object fieldValue = field.get(data);
	                    if (fieldValue != null && !field.getName().equals(tableId)) {
	                        preparedStatement.setObject(index, fieldValue);
	                        index++;
	                    }
	                } 
	                catch (IllegalAccessException e) {
	                    e.printStackTrace();
	                }
	            }
	            preparedStatement.setObject(index, tableIdValue);
	            return preparedStatement;
	        }
	    });
	}
	
	public void delete(Integer id) {
		String sql = String.format("DELETE FROM %s WHERE %s=%s;", tableName, tableId, id);
		
	    this.jdbcTemplate.update(new PreparedStatementCreator() {
	        @Override
	        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
	            return con.prepareStatement(sql);
	        }
	    });
	}
}