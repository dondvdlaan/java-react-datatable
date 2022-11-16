package com.manyroads.server;

import com.manyroads.server.model.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Main class for this Datatable application. The commandLineRunner is used to
 * fill the database and to be able start a demo.
 */
@SpringBootApplication
public class ServerMain {

	public static void main(String[] args) {
		SpringApplication.run(ServerMain.class, args);
	}

}
