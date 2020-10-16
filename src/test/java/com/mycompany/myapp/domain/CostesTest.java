package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class CostesTest {

    @Test
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
