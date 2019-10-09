package com.mycompany.myapp.repository;
import com.mycompany.myapp.domain.Tareas;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Tareas entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TareasRepository extends JpaRepository<Tareas, Long> {

}
