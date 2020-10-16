package com.mycompany.myapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.mycompany.myapp.domain.enumeration.Tipo;

import com.mycompany.myapp.domain.enumeration.Estado;

/**
 * A Peticion.
 */
@Entity
@Table(name = "peticion")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "peticion")
public class Peticion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo")
    private String codigo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private Tipo tipo;

    @Column(name = "asunto")
    private String asunto;

    @Column(name = "descripcion")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "propietario")
    private String propietario;

    @OneToMany(mappedBy = "peticion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Costes> costes = new HashSet<>();

    @OneToMany(mappedBy = "peticion")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Tareas> tareas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public Peticion codigo(String codigo) {
        this.codigo = codigo;
        return this;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public Peticion tipo(Tipo tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public String getAsunto() {
        return asunto;
    }

    public Peticion asunto(String asunto) {
        this.asunto = asunto;
        return this;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Peticion descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Estado getEstado() {
        return estado;
    }

    public Peticion estado(Estado estado) {
        this.estado = estado;
        return this;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public String getPropietario() {
        return propietario;
    }

    public Peticion propietario(String propietario) {
        this.propietario = propietario;
        return this;
    }

    public void setPropietario(String propietario) {
        this.propietario = propietario;
    }

    public Set<Costes> getCostes() {
        return costes;
    }

    public Peticion costes(Set<Costes> costes) {
        this.costes = costes;
        return this;
    }

    public Peticion addCostes(Costes costes) {
        this.costes.add(costes);
        costes.setPeticion(this);
        return this;
    }

    public Peticion removeCostes(Costes costes) {
        this.costes.remove(costes);
        costes.setPeticion(null);
        return this;
    }

    public void setCostes(Set<Costes> costes) {
        this.costes = costes;
    }

    public Set<Tareas> getTareas() {
        return tareas;
    }

    public Peticion tareas(Set<Tareas> tareas) {
        this.tareas = tareas;
        return this;
    }

    public Peticion addTareas(Tareas tareas) {
        this.tareas.add(tareas);
        tareas.setPeticion(this);
        return this;
    }

    public Peticion removeTareas(Tareas tareas) {
        this.tareas.remove(tareas);
        tareas.setPeticion(null);
        return this;
    }

    public void setTareas(Set<Tareas> tareas) {
        this.tareas = tareas;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Peticion)) {
            return false;
        }
        return id != null && id.equals(((Peticion) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Peticion{" +
            "id=" + getId() +
            ", codigo='" + getCodigo() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", asunto='" + getAsunto() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", estado='" + getEstado() + "'" +
            ", propietario='" + getPropietario() + "'" +
            "}";
    }
}
