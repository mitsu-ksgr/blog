#!/bin/bash +x
set -eu
umask 0022

readonly SCRIPT_NAME=$(basename $0)


#
# Prepare tmp dir
#
unset TMP_DIR
on_exit() {
    [ -n "${TMP_DIR}" ] && rm -rf "${TMP_DIR}";
}
trap on_exit EXIT
trap 'trap - EXIT; on_exit; exit -1;' INT PIPE TERM
readonly TMP_DIR=$(mktemp -d "/tmp/${SCRIPT_NAME}.tmp.XXXXXX")



#
# Usage
#
usage() {
    cat <<__EOS__
Usage:
    ${SCRIPT_NAME} [-h] [-b] [-p PORT]

Description:
    Test the contents of the build via the local server.

Options:
    -h show usage.
    -b build.
    -p port number.
__EOS__
}


#
# Options
#
DEFAULT_PORT=8888
OPT_PORT=$DEFAULT_PORT
OPT_BUILD=false

parse_args() {
    while getopts hbp: flag; do
        case "${flag}" in
            h )
                usage
                exit 0
                ;;
            b )
                OPT_BUILD=true
                ;;
            p )
                OPT_PORT=${OPTARG}
                ;;
            * )
                usage
                exit 0
                ;;
        esac
    done
}

err() { echo "Error: $@" 1>&2; exit 1; }


main() {
    parse_args $@
    shift `expr $OPTIND - 1`


    #--------------------------------------------
    # Build
    if [ "${OPT_BUILD}" = "true" ]; then
        echo "* Build"
        docker-compose run --rm app yarn build
        echo ""
    fi


    #--------------------------------------------
    # Copy the contents to the tmp dir
    if [ -z "${TMP_DIR}" ]; then
        err "Failed to mktmp"
    fi
    cp -R ./build $TMP_DIR/blog
    cd $TMP_DIR


    #--------------------------------------------
    # Start the server
    echo "* Server"
    echo "Port: $OPT_PORT"
    echo "URL : http://localhost:${OPT_PORT}/blog/"
    echo ""
    echo "Use Ctrl+C to exit server."
    echo ""
    python3 -m http.server $OPT_PORT
}

main $@
exit 0

