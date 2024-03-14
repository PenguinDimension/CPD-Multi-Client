/*
   |-------------------------------------------------------------------------------------------------------|
   |EXTENSÃO DE CORREÇÃO DE ACENTOS E DE ALGUNS CARACTERES ESPECIAIS PARA ENVIO CORRETO DE ISSUES DO GITHUB|
   |                         © Copyright - Todos os direitos reservados a PiterOfc                         |
   |-------------------------------------------------------------------------------------------------------|
*/

// LISTA DE VÁRIOS CARACTERES ESPECIAIS: https://www.homehost.com.br/blog/tutoriais/caracteres-especiais-acentos-html

const corrigirAcentos = function(string) {
  let caracteres = {
    'á': '&aacute;',
    'é': '&eacute;',
    'í': '&iacute;',
    'ó': '&oacute;',
    'ú': '&uacute;',
    'à': '&agrave;',
    'è': '&egrave;',
    'ì': '&igrave;',
    'ò': '&ograve;',
    'ù': '&ugrave;',
    'ã': '&atilde;',
    'õ': '&otilde;',
    'â': '&acirc;',
    'ê': '&ecirc;',
    'î': '&icirc;',
    'ô': '&ocirc;',
    'û': '&ucirc;',
    'ä': '&auml;',
    'ë': '&euml;',
    'ï': '&iuml;',
    'ö': '&ouml;',
    'ü': '&uuml;',
    'ç': '&ccedil;',
    'ñ': '&ntilde;',
    'ý': '&yacute;',
    'Á': '&Aacute;',
    'É': '&Eacute;',
    'Í': '&Iacute;',
    'Ó': '&Oacute;',
    'Ú': '&Uacute;',
    'À': '&Agrave;',
    'È': '&Egrave;',
    'Ì': '&Igrave;',
    'Ò': '&Ograve;',
    'Ù': '&Ugrave;',
    'Ã': '&Atilde;',
    'Õ': '&Otilde;',
    'Â': '&Acirc;',
    'Ê': '&Ecirc;',
    'Î': '&Icirc;',
    'Ô': '&Ocirc;',
    'Û': '&Ucirc;',
    'Ä': '&Auml;',
    'Ë': '&Euml;',
    'Ï': '&Iuml;',
    'Ö': '&Ouml;',
    'Ü': '&Uuml;',
    'Ç': '&Ccedil;',
    'Ñ': '&Ntilde;',
    'Ý': '&Yacute;'
  };
  return string.replace(/[áéíóúàèìòùãõâêîôûäëïöüçñýÁÉÍÓÚÀÈÌÒÙÃÕÂÊÎÔÛÄËÏÖÜÇÑÝ]/g, match => caracteres[match]);
};

module.exports = {corrigirAcentos};