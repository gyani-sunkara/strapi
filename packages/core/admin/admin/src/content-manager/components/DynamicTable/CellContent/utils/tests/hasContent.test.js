import hasContent from '../hasContent';

describe('hasContent', () => {
  describe('number fields', () => {
    it('returns true for integer', () => {
      const normalizedContent = hasContent('integer', 1);
      expect(normalizedContent).toEqual(true);
    });

    it('returns false for string integer', () => {
      const normalizedContent = hasContent('integer', '1');
      expect(normalizedContent).toEqual(false);
    });

    it('returns false for undefined text', () => {
      const normalizedContent = hasContent('integer', undefined);
      expect(normalizedContent).toEqual(false);
    });

    it('returns true for float', () => {
      const normalizedContent = hasContent('float', 1.111);
      expect(normalizedContent).toEqual(true);
    });

    it('returns true for decimal', () => {
      const normalizedContent = hasContent('decimal', 1.111);
      expect(normalizedContent).toEqual(true);
    });

    it('returns true for biginteger', () => {
      const normalizedContent = hasContent('biginteger', '12345678901234567890');
      expect(normalizedContent).toEqual(true);
    });
  });

  describe('text', () => {
    it('returns true for text content', () => {
      const normalizedContent = hasContent('text', 'content');
      expect(normalizedContent).toEqual(true);
    });

    it('returns false for empty text content', () => {
      const normalizedContent = hasContent('text', '');
      expect(normalizedContent).toEqual(false);
    });

    it('returns false for undefined text content', () => {
      const normalizedContent = hasContent('text', undefined);
      expect(normalizedContent).toEqual(false);
    });
  });

  describe('single component', () => {
    it('extracts content from single components with content', () => {
      const normalizedContent = hasContent(
        'component',
        { name: 'content', id: 1 },
        { mainField: { name: 'name' } }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from single components without content', () => {
      const normalizedContent = hasContent(
        'component',
        { name: '', id: 1 },
        { mainField: { name: 'name' } }
      );
      expect(normalizedContent).toEqual(false);
    });

    it('extracts integers from single components with content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: 1, id: 1 },
        { mainField: { name: 'number', type: 'integer' } }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts integers from single components without content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: null, id: 1 },
        { mainField: { name: 'number', type: 'integer' } }
      );
      expect(normalizedContent).toEqual(false);
    });

    it('extracts float from single components with content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: 1.11, id: 1 },
        { mainField: { name: 'number', type: 'float' } }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts float from single components without content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: null, id: 1 },
        { mainField: { name: 'number', type: 'float' } }
      );
      expect(normalizedContent).toEqual(false);
    });

    it('extracts decimal from single components with content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: 1.11, id: 1 },
        { mainField: { name: 'number', type: 'decimal' } }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts decimal from single components without content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: null, id: 1 },
        { mainField: { name: 'number', type: 'decimal' } }
      );
      expect(normalizedContent).toEqual(false);
    });

    it('extracts biginteger from single components with content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: '12345678901234567890', id: 1 },
        { mainField: { name: 'number', type: 'biginteger' } }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts biginteger from single components without content', () => {
      const normalizedContent = hasContent(
        'component',
        { number: null, id: 1 },
        { mainField: { name: 'number', type: 'biginteger' } }
      );
      expect(normalizedContent).toEqual(false);
    });
  });

  describe('repeatable components', () => {
    it('extracts content from repeatable components with content', () => {
      const normalizedContent = hasContent(
        'component',
        [{ name: 'content_2', value: 'truthy', id: 1 }],
        { mainField: { name: 'content_2' } },
        { repeatable: true }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from repeatable components without content', () => {
      const normalizedContent = hasContent(
        'component',
        [{ name: 'content_2', value: '', id: 1 }],
        { mainField: { name: 'content_2' } },
        { repeatable: true }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from repeatable components without content', () => {
      const normalizedContent = hasContent(
        'component',
        [{ id: 1 }, { id: 2 }],
        { mainField: { name: 'content_2' } },
        { repeatable: true }
      );
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from repeatable components without content', () => {
      const normalizedContent = hasContent(
        'component',
        [],
        { mainField: { name: 'content_2' } },
        { repeatable: true }
      );
      expect(normalizedContent).toEqual(false);
    });
  });

  describe('relations', () => {
    it('extracts content from multiple relations with content', () => {
      const normalizedContent = hasContent('relation', { count: 1 }, undefined, {
        relation: 'manyToMany',
      });
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from multiple relations without content', () => {
      const normalizedContent = hasContent('relation', { count: 0 }, undefined, {
        relation: 'manyToMany',
      });
      expect(normalizedContent).toEqual(false);
    });

    it('extracts content from single relations with content', () => {
      const normalizedContent = hasContent('relation', { id: 1 }, undefined, {
        relation: 'oneToOne',
      });
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from single relations without content', () => {
      const normalizedContent = hasContent('relation', null, undefined, {
        relation: 'oneToOne',
      });
      expect(normalizedContent).toEqual(false);
    });

    it('returns oneToManyMorph relations as false with content', () => {
      const normalizedContent = hasContent('relation', { id: 1 }, undefined, {
        relation: 'oneToManyMorph',
      });
      expect(normalizedContent).toEqual(false);
    });

    it('extracts content from oneToManyMorph relations with content', () => {
      const normalizedContent = hasContent('relation', { id: 1 }, undefined, {
        relation: 'oneToOneMorph',
      });
      expect(normalizedContent).toEqual(true);
    });

    it('extracts content from oneToManyMorph relations with content', () => {
      const normalizedContent = hasContent('relation', null, undefined, {
        relation: 'oneToOneMorph',
      });
      expect(normalizedContent).toEqual(false);
    });
  });
});
