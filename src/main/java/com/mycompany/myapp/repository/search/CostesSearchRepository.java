package com.mycompany.myapp.repository.search;
import com.mycompany.myapp.domain.Costes;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Costes} entity.
 */
public interface CostesSearchRepository extends ElasticsearchRepository<Costes, Long> {
}
