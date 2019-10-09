package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Tareas;
import com.mycompany.myapp.repository.TareasRepository;
import com.mycompany.myapp.repository.search.TareasSearchRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Tareas}.
 */
@RestController
@RequestMapping("/api")
public class TareasResource {

    private final Logger log = LoggerFactory.getLogger(TareasResource.class);

    private static final String ENTITY_NAME = "tareas";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TareasRepository tareasRepository;

    private final TareasSearchRepository tareasSearchRepository;

    public TareasResource(TareasRepository tareasRepository, TareasSearchRepository tareasSearchRepository) {
        this.tareasRepository = tareasRepository;
        this.tareasSearchRepository = tareasSearchRepository;
    }

    /**
     * {@code POST  /tareas} : Create a new tareas.
     *
     * @param tareas the tareas to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tareas, or with status {@code 400 (Bad Request)} if the tareas has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tareas")
    public ResponseEntity<Tareas> createTareas(@RequestBody Tareas tareas) throws URISyntaxException {
        log.debug("REST request to save Tareas : {}", tareas);
        if (tareas.getId() != null) {
            throw new BadRequestAlertException("A new tareas cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tareas result = tareasRepository.save(tareas);
        tareasSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tareas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tareas} : Updates an existing tareas.
     *
     * @param tareas the tareas to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tareas,
     * or with status {@code 400 (Bad Request)} if the tareas is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tareas couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tareas")
    public ResponseEntity<Tareas> updateTareas(@RequestBody Tareas tareas) throws URISyntaxException {
        log.debug("REST request to update Tareas : {}", tareas);
        if (tareas.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tareas result = tareasRepository.save(tareas);
        tareasSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tareas.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tareas} : get all the tareas.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tareas in body.
     */
    @GetMapping("/tareas")
    public ResponseEntity<List<Tareas>> getAllTareas(Pageable pageable) {
        log.debug("REST request to get a page of Tareas");
        Page<Tareas> page = tareasRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /tareas/:id} : get the "id" tareas.
     *
     * @param id the id of the tareas to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tareas, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tareas/{id}")
    public ResponseEntity<Tareas> getTareas(@PathVariable Long id) {
        log.debug("REST request to get Tareas : {}", id);
        Optional<Tareas> tareas = tareasRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tareas);
    }

    /**
     * {@code DELETE  /tareas/:id} : delete the "id" tareas.
     *
     * @param id the id of the tareas to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tareas/{id}")
    public ResponseEntity<Void> deleteTareas(@PathVariable Long id) {
        log.debug("REST request to delete Tareas : {}", id);
        tareasRepository.deleteById(id);
        tareasSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/tareas?query=:query} : search for the tareas corresponding
     * to the query.
     *
     * @param query the query of the tareas search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/tareas")
    public ResponseEntity<List<Tareas>> searchTareas(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Tareas for query {}", query);
        Page<Tareas> page = tareasSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
