package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

import com.mycompany.myapp.domain.enumeration.Estado;

/**
 * A Tareas.
 */
@Entity
@Table(name = "tareas")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "tareas")
public class Tareas implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "responsable")
    private String responsable;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descripcion")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "fechafin")
    private Instant fechafin;

    @ManyToOne
    @JsonIgnoreProperties(value = "tareas", allowSetters = true)
    private Peticion peticion;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResponsable() {
        return responsable;
    }

    public Tareas responsable(String responsable) {
        this.responsable = responsable;
        return this;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getTitulo() {
        return titulo;
    }

    public Tareas titulo(String titulo) {
        this.titulo = titulo;
        return this;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Tareas descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Estado getEstado() {
        return estado;
    }

    public Tareas estado(Estado estado) {
        this.estado = estado;
        return this;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Instant getFechafin() {
        return fechafin;
    }

    public Tareas fechafin(Instant fechafin) {
        this.fechafin = fechafin;
        return this;
    }

    public void setFechafin(Instant fechafin) {
        this.fechafin = fechafin;
    }

    public Peticion getPeticion() {
        return peticion;
    }

    public Tareas peticion(Peticion peticion) {
        this.peticion = peticion;
        return this;
    }

    public void setPeticion(Peticion peticion) {
        this.peticion = peticion;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tareas)) {
            return false;
        }
        return id != null && id.equals(((Tareas) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tareas{" +
            "id=" + getId() +
            ", responsable='" + getResponsable() + "'" +
            ", titulo='" + getTitulo() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", estado='" + getEstado() + "'" +
            ", fechafin='" + getFechafin() + "'" +
            "}";
    }
}
