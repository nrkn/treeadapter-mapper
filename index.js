'use strict'

const Mapper = ( sourceAdapter, targetAdapter ) => {
  let targetDocument

  const predicates = {
    element: sourceAdapter.isElementNode,
    comment: sourceAdapter.isCommentNode,
    documentType: sourceAdapter.isDocumentTypeNode,
    document: obj => true
  }

  const mapChildren = ( targetNode, childNodes ) => {
    if( Array.isArray( childNodes ) )
      childNodes.forEach( child => {
        if( sourceAdapter.isTextNode( child ) ){
          const text = sourceAdapter.getTextNodeContent( child )
          if( text && text !== '' )
            targetAdapter.insertText( targetNode, text )
        } else {
          const node = map( child )
          // when setting doctype, map won't return anything
          if( node )
            targetAdapter.appendChild( targetNode, node )
        }
      })
  }

  const element = node => {
    const tagName = sourceAdapter.getTagName( node )
    const attrs = sourceAdapter.getAttrList( node )
    const namespaceURI = sourceAdapter.getNamespaceURI( node )
    const childNodes = sourceAdapter.getChildNodes( node )

    const el = targetAdapter.createElement( tagName,  namespaceURI, attrs )

    mapChildren( el, childNodes )

    return el
  }

  const comment = node => {
    const data = sourceAdapter.getCommentNodeContent( node )

    return targetAdapter.createCommentNode( data )
  }

  const documentType = node => {
    const name = sourceAdapter.getDocumentTypeNodeName( node )
    const publicId = sourceAdapter.getDocumentTypeNodePublicId( node )
    const systemId = sourceAdapter.getDocumentTypeNodeSystemId( node )

    targetAdapter.setDocumentType( targetDocument, name, publicId, systemId )
  }

  const doc = node => {
    const document = targetDocument = targetAdapter.createDocument()
    const childNodes = sourceAdapter.getChildNodes( node )

    mapChildren( document, childNodes )

    return document
  }

  const mappers = { element, comment, documentType, document: doc, documentFragment: mapChildren }

  const map = obj => {
    const mapperName = Object.keys( predicates ).find( key => predicates[ key ]( obj ) )

    return mappers[ mapperName ]( obj )
  }

  return map
}

module.exports = Mapper
