package com.mycompany.myapp.repository;
import com.mycompany.myapp.domain.Peticion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Peticion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PeticionRepository extends JpaRepository<Peticion, Long> {

}
