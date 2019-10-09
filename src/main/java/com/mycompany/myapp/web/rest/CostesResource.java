package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Costes;
import com.mycompany.myapp.repository.CostesRepository;
import com.mycompany.myapp.repository.search.CostesSearchRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Costes}.
 */
@RestController
@RequestMapping("/api")
public class CostesResource {

    private final Logger log = LoggerFactory.getLogger(CostesResource.class);

    private static final String ENTITY_NAME = "costes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CostesRepository costesRepository;

    private final CostesSearchRepository costesSearchRepository;

    public CostesResource(CostesRepository costesRepository, CostesSearchRepository costesSearchRepository) {
        this.costesRepository = costesRepository;
        this.costesSearchRepository = costesSearchRepository;
    }

    /**
     * {@code POST  /costes} : Create a new costes.
     *
     * @param costes the costes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new costes, or with status {@code 400 (Bad Request)} if the costes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/costes")
    public ResponseEntity<Costes> createCostes(@RequestBody Costes costes) throws URISyntaxException {
        log.debug("REST request to save Costes : {}", costes);
        if (costes.getId() != null) {
            throw new BadRequestAlertException("A new costes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Costes result = costesRepository.save(costes);
        costesSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/costes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /costes} : Updates an existing costes.
     *
     * @param costes the costes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated costes,
     * or with status {@code 400 (Bad Request)} if the costes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the costes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/costes")
    public ResponseEntity<Costes> updateCostes(@RequestBody Costes costes) throws URISyntaxException {
        log.debug("REST request to update Costes : {}", costes);
        if (costes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Costes result = costesRepository.save(costes);
        costesSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, costes.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /costes} : get all the costes.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of costes in body.
     */
    @GetMapping("/costes")
    public ResponseEntity<List<Costes>> getAllCostes(Pageable pageable) {
        log.debug("REST request to get a page of Costes");
        Page<Costes> page = costesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /costes/:id} : get the "id" costes.
     *
     * @param id the id of the costes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the costes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/costes/{id}")
    public ResponseEntity<Costes> getCostes(@PathVariable Long id) {
        log.debug("REST request to get Costes : {}", id);
        Optional<Costes> costes = costesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(costes);
    }

    /**
     * {@code DELETE  /costes/:id} : delete the "id" costes.
     *
     * @param id the id of the costes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/costes/{id}")
    public ResponseEntity<Void> deleteCostes(@PathVariable Long id) {
        log.debug("REST request to delete Costes : {}", id);
        costesRepository.deleteById(id);
        costesSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/costes?query=:query} : search for the costes corresponding
     * to the query.
     *
     * @param query the query of the costes search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/costes")
    public ResponseEntity<List<Costes>> searchCostes(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Costes for query {}", query);
        Page<Costes> page = costesSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
