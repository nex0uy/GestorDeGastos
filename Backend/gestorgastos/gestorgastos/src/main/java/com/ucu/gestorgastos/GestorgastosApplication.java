package com.ucu.gestorgastos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ucu.gestorgastos"})
public class GestorgastosApplication {
	public static void main(String[] args) {
		SpringApplication.run(GestorgastosApplication.class, args);
	}
}



