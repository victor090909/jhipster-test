package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterTestApp;
import com.mycompany.myapp.domain.Costes;
import com.mycompany.myapp.repository.CostesRepository;
import com.mycompany.myapp.repository.search.CostesSearchRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.Estado;
/**
 * Integration tests for the {@link CostesResource} REST controller.
 */
@SpringBootTest(classes = JhipsterTestApp.class)
public class CostesResourceIT {

    private static final String DEFAULT_PROVEEDOR = "AAAAAAAAAA";
    private static final String UPDATED_PROVEEDOR = "BBBBBBBBBB";

    private static final String DEFAULT_SERVICIO = "AAAAAAAAAA";
    private static final String UPDATED_SERVICIO = "BBBBBBBBBB";

    private static final Estado DEFAULT_ESTADO = Estado.NUEVA;
    private static final Estado UPDATED_ESTADO = Estado.ENCURSO;

    private static final Long DEFAULT_COSTE = 1L;
    private static final Long UPDATED_COSTE = 2L;
    private static final Long SMALLER_COSTE = 1L - 1L;

    @Autowired
    private CostesRepository costesRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.CostesSearchRepositoryMockConfiguration
     */
    @Autowired
    private CostesSearchRepository mockCostesSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCostesMockMvc;

    private Costes costes;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CostesResource costesResource = new CostesResource(costesRepository, mockCostesSearchRepository);
        this.restCostesMockMvc = MockMvcBuilders.standaloneSetup(costesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Costes createEntity(EntityManager em) {
        Costes costes = new Costes()
            .proveedor(DEFAULT_PROVEEDOR)
            .servicio(DEFAULT_SERVICIO)
            .estado(DEFAULT_ESTADO)
            .coste(DEFAULT_COSTE);
        return costes;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Costes createUpdatedEntity(EntityManager em) {
        Costes costes = new Costes()
            .proveedor(UPDATED_PROVEEDOR)
            .servicio(UPDATED_SERVICIO)
            .estado(UPDATED_ESTADO)
            .coste(UPDATED_COSTE);
        return costes;
    }

    @BeforeEach
    public void initTest() {
        costes = createEntity(em);
    }

    @Test
    @Transactional
    public void createCostes() throws Exception {
        int databaseSizeBeforeCreate = costesRepository.findAll().size();

        // Create the Costes
        restCostesMockMvc.perform(post("/api/costes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(costes)))
            .andExpect(status().isCreated());

        // Validate the Costes in the database
        List<Costes> costesList = costesRepository.findAll();
        assertThat(costesList).hasSize(databaseSizeBeforeCreate + 1);
        Costes testCostes = costesList.get(costesList.size() - 1);
        assertThat(testCostes.getProveedor()).isEqualTo(DEFAULT_PROVEEDOR);
        assertThat(testCostes.getServicio()).isEqualTo(DEFAULT_SERVICIO);
        assertThat(testCostes.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testCostes.getCoste()).isEqualTo(DEFAULT_COSTE);

        // Validate the Costes in Elasticsearch
        verify(mockCostesSearchRepository, times(1)).save(testCostes);
    }

    @Test
    @Transactional
    public void createCostesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = costesRepository.findAll().size();

        // Create the Costes with an existing ID
        costes.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCostesMockMvc.perform(post("/api/costes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(costes)))
            .andExpect(status().isBadRequest());

        // Validate the Costes in the database
        List<Costes> costesList = costesRepository.findAll();
        assertThat(costesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Costes in Elasticsearch
        verify(mockCostesSearchRepository, times(0)).save(costes);
    }


    @Test
    @Transactional
    public void getAllCostes() throws Exception {
        // Initialize the database
        costesRepository.saveAndFlush(costes);

        // Get all the costesList
        restCostesMockMvc.perform(get("/api/costes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(costes.getId().intValue())))
            .andExpect(jsonPath("$.[*].proveedor").value(hasItem(DEFAULT_PROVEEDOR.toString())))
            .andExpect(jsonPath("$.[*].servicio").value(hasItem(DEFAULT_SERVICIO.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].coste").value(hasItem(DEFAULT_COSTE.intValue())));
    }
    
    @Test
    @Transactional
    public void getCostes() throws Exception {
        // Initialize the database
        costesRepository.saveAndFlush(costes);

        // Get the costes
        restCostesMockMvc.perform(get("/api/costes/{id}", costes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(costes.getId().intValue()))
            .andExpect(jsonPath("$.proveedor").value(DEFAULT_PROVEEDOR.toString()))
            .andExpect(jsonPath("$.servicio").value(DEFAULT_SERVICIO.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.coste").value(DEFAULT_COSTE.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCostes() throws Exception {
        // Get the costes
        restCostesMockMvc.perform(get("/api/costes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCostes() throws Exception {
        // Initialize the database
        costesRepository.saveAndFlush(costes);

        int databaseSizeBeforeUpdate = costesRepository.findAll().size();

        // Update the costes
        Costes updatedCostes = costesRepository.findById(costes.getId()).get();
        // Disconnect from session so that the updates on updatedCostes are not directly saved in db
        em.detach(updatedCostes);
        updatedCostes
            .proveedor(UPDATED_PROVEEDOR)
            .servicio(UPDATED_SERVICIO)
            .estado(UPDATED_ESTADO)
            .coste(UPDATED_COSTE);

        restCostesMockMvc.perform(put("/api/costes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCostes)))
            .andExpect(status().isOk());

        // Validate the Costes in the database
        List<Costes> costesList = costesRepository.findAll();
        assertThat(costesList).hasSize(databaseSizeBeforeUpdate);
        Costes testCostes = costesList.get(costesList.size() - 1);
        assertThat(testCostes.getProveedor()).isEqualTo(UPDATED_PROVEEDOR);
        assertThat(testCostes.getServicio()).isEqualTo(UPDATED_SERVICIO);
        assertThat(testCostes.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testCostes.getCoste()).isEqualTo(UPDATED_COSTE);

        // Validate the Costes in Elasticsearch
        verify(mockCostesSearchRepository, times(1)).save(testCostes);
    }

    @Test
    @Transactional
    public void updateNonExistingCostes() throws Exception {
        int databaseSizeBeforeUpdate = costesRepository.findAll().size();

        // Create the Costes

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCostesMockMvc.perform(put("/api/costes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(costes)))
            .andExpect(status().isBadRequest());

        // Validate the Costes in the database
        List<Costes> costesList = costesRepository.findAll();
        assertThat(costesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Costes in Elasticsearch
        verify(mockCostesSearchRepository, times(0)).save(costes);
    }

    @Test
    @Transactional
    public void deleteCostes() throws Exception {
        // Initialize the database
        costesRepository.saveAndFlush(costes);

        int databaseSizeBeforeDelete = costesRepository.findAll().size();

        // Delete the costes
        restCostesMockMvc.perform(delete("/api/costes/{id}", costes.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Costes> costesList = costesRepository.findAll();
        assertThat(costesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Costes in Elasticsearch
        verify(mockCostesSearchRepository, times(1)).deleteById(costes.getId());
    }

    @Test
    @Transactional
    public void searchCostes() throws Exception {
        // Initialize the database
        costesRepository.saveAndFlush(costes);
        when(mockCostesSearchRepository.search(queryStringQuery("id:" + costes.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(costes), PageRequest.of(0, 1), 1));
        // Search the costes
        restCostesMockMvc.perform(get("/api/_search/costes?query=id:" + costes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(costes.getId().intValue())))
            .andExpect(jsonPath("$.[*].proveedor").value(hasItem(DEFAULT_PROVEEDOR)))
            .andExpect(jsonPath("$.[*].servicio").value(hasItem(DEFAULT_SERVICIO)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].coste").value(hasItem(DEFAULT_COSTE.intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Costes.class);
        Costes costes1 = new Costes();
        costes1.setId(1L);
        Costes costes2 = new Costes();
        costes2.setId(costes1.getId());
        assertThat(costes1).isEqualTo(costes2);
        costes2.setId(2L);
        assertThat(costes1).isNotEqualTo(costes2);
        costes1.setId(null);
        assertThat(costes1).isNotEqualTo(costes2);
    }
}
