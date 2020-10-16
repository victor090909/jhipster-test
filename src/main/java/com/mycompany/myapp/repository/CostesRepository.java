package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Costes;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Costes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CostesRepository extends JpaRepository<Costes, Long> {
}
