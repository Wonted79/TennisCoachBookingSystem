package com.tcb_server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.tcb_server")
@SpringBootApplication
public class TcbServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TcbServerApplication.class, args);
	}

}
