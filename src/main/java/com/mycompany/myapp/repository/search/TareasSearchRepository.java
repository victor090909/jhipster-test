package com.mycompany.myapp.repository.search;

import com.mycompany.myapp.domain.Tareas;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * Spring Data Elasticsearch repository for the {@link Tareas} entity.
 */
public interface TareasSearchRepository extends ElasticsearchRepository<Tareas, Long> {
}
